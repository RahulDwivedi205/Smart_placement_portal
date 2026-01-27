import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { getErrorMessage } from '../utils';

// Generic API hook for GET requests
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    dependencies = []
  } = options;

  const execute = useCallback(async (customUrl = url) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(customUrl);
      const result = response.data.success ? response.data.data : response.data;
      
      setData(result);
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
};

// Hook for POST/PUT/DELETE operations
export const useMutation = (options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    onSettled
  } = options;

  const mutate = useCallback(async (url, data, method = 'POST') => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toUpperCase()) {
        case 'POST':
          response = await api.post(url, data);
          break;
        case 'PUT':
          response = await api.put(url, data);
          break;
        case 'PATCH':
          response = await api.patch(url, data);
          break;
        case 'DELETE':
          response = await api.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      const result = response.data.success ? response.data.data : response.data;
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }, [onSuccess, onError, onSettled]);

  return {
    mutate,
    loading,
    error
  };
};

// Hook for paginated data
export const usePaginatedApi = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    onSuccess,
    onError
  } = options;

  const fetchData = useCallback(async (page = 1, limit = 10, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${url}?page=${page}&limit=${limit}`);
      const result = response.data;

      if (reset) {
        setData(result.data || []);
      } else {
        setData(prev => [...prev, ...(result.data || [])]);
      }

      setPagination({
        page: result.page || page,
        limit: result.limit || limit,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });

      onSuccess?.(result);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (immediate && url) {
      fetchData(1, pagination.limit, true);
    }
  }, [immediate, url]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading) {
      fetchData(pagination.page + 1, pagination.limit, false);
    }
  }, [fetchData, pagination, loading]);

  const refresh = useCallback(() => {
    fetchData(1, pagination.limit, true);
  }, [fetchData, pagination.limit]);

  return {
    data,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    hasMore: pagination.page < pagination.totalPages
  };
};