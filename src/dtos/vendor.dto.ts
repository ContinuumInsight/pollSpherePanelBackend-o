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

export interface RedirectsDTO {
  completeRedirect?: string;
  terminateRedirect?: string;
  quotaFullRedirect?: string;
  securityRedirect?: string;
}

export interface BankDetailsDTO {
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  micrCode?: string;
  bankAddress?: string;
  swiftCode?: string;
  currency?: string[];
  intermediaryAccountNo?: string;
  intermediarySwiftCode?: string;
}

export interface CreateVendorDTO {
  name: string;
  email: string;
  phone: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  currency: string[];
  companyInfo: CompanyInfoDTO;
  address?: AddressDTO;
  redirects?: RedirectsDTO;
  bankDetails?: BankDetailsDTO;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdateVendorDTO {
  name?: string;
  email?: string;
  phone?: string;
  tier?: 'tier_1' | 'tier_2' | 'tier_3';
  currency?: string[];
  companyInfo?: Partial<CompanyInfoDTO>;
  address?: AddressDTO;
  redirects?: RedirectsDTO;
  bankDetails?: BankDetailsDTO;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface VendorResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  currency: string[];
  companyInfo: CompanyInfoDTO;
  address: AddressDTO;
  redirects: RedirectsDTO;
  bankDetails?: BankDetailsDTO;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListVendorsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tier?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListVendorsResponseDTO {
  vendors: VendorResponseDTO[];
  pagination: PaginationDTO;
}
