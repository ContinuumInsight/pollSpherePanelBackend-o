export interface CountryDTO {
  name: string;
  isoCode: string;
  countryCode: string;
  language: string;
}

export interface VendorFilterDTO {
  vendorId: string;
  vendorName: string;
  vendorCurrency: string[];
  redirects: {
    completeRedirect?: string;
    terminateRedirect?: string;
    quotaFullRedirect?: string;
    securityRedirect?: string;
  };
}

export interface ClientFilterDTO {
  clientId: string;
  clientName: string;
  clientCurrency: string[];
}

export interface FilterResponseDTO {
  id: string;
  countries: CountryDTO[];
  vendors: VendorFilterDTO[];
  gender: string[];
  clients: ClientFilterDTO[];
  status: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AddOrUpdateCountriesDTO {
  countries: CountryDTO[];
}
