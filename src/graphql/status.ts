import { gql } from "@apollo/client";

export const API_STATUS_QUERY = gql`
  query ApiStatus {
    apiStatus
  }
`;
