export interface CompanyInfoDTO {
  companyName: string;
  website?: string;
  taxId?: string;
  panNumber?: string;
  msme?: string;
  cinNumber?: string;
}

export interface AddressDTO {
  country?: string;
  stateProvince?: string;
  city?: string;
  zipCode?: string;
  completeAddress?: string;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  companyInfo: CompanyInfoDTO;
  address?: AddressDTO;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  companyInfo?: Partial<CompanyInfoDTO>;
  address?: AddressDTO;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface ClientResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyInfo: CompanyInfoDTO;
  address: AddressDTO;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListClientsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListClientsResponseDTO {
  clients: ClientResponseDTO[];
  pagination: PaginationDTO;
}
