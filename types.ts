import React from 'react';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  iconUrl?: string; // Optional custom icon URL
}

export enum SearchEngine {
  Google = 'google',
  Baidu = 'baidu',
  Bing = 'bing',
}

export interface SearchEngineConfig {
  name: string;
  url: string;
  queryParam: string;
  placeholder: string;
  icon?: React.ReactNode;
}