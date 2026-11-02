const API_BASE = 'https://api-eight-navy-68.vercel.app/api/d';

interface DataItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  file_size?: number;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

interface CreateDataItemRequest {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId?: string;
  isPublic?: boolean;
}

interface UpdateDataItemRequest {
  name?: string;
  content?: string;
  isPublic?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const getDataItems = async (parentId?: string): Promise<DataItem[]> => {
  try {
    const url = new URL(`${API_BASE}/list`);
    if (parentId) {
      url.searchParams.set('parentId', parentId);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching data items:', error);
    throw error;
  }
};

export const getDataItem = async (id: string): Promise<DataItem> => {
  try {
    const response = await fetch(`${API_BASE}/v/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch item: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching data item:', error);
    throw error;
  }
};

export const createDataItem = async (data: CreateDataItemRequest): Promise<DataItem> => {
  try {
    const response = await fetch(`${API_BASE}/new`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        content: data.content || '',
        parent_id: data.parentId,
        isPublic: data.isPublic || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create item: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating data item:', error);
    throw error;
  }
};

export const updateDataItem = async (id: string, data: UpdateDataItemRequest): Promise<DataItem> => {
  try {
    const response = await fetch(`${API_BASE}/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update item: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating data item:', error);
    throw error;
  }
};

export const deleteDataItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete item: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting data item:', error);
    throw error;
  }
};

export const searchDataItems = async (query: string, type?: 'file' | 'folder'): Promise<DataItem[]> => {
  try {
    const url = new URL(`${API_BASE}/search`);
    url.searchParams.set('q', query);
    if (type) {
      url.searchParams.set('type', type);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to search items: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error searching data items:', error);
    throw error;
  }
};

export const getPublicItem = async (id: string): Promise<DataItem> => {
  try {
    const response = await fetch(`${API_BASE}/p/${id}/json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public item: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching public item:', error);
    throw error;
  }
};

export const getPublicItemRaw = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/p/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public item: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching public item raw:', error);
    throw error;
  }
};

export const getUserFiles = async (): Promise<DataItem[]> => {
  try {
    const response = await fetch(`${API_BASE}/files`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const result = await response.json();
    return result.files || [];
  } catch (error) {
    console.error('Error fetching user files:', error);
    throw error;
  }
};