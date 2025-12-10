import { LinkItem, SearchEngine, SearchEngineConfig } from './types';
import { Globe, Search } from 'lucide-react';
import React from 'react';

export const INITIAL_LINKS: LinkItem[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com' },
  { id: '2', title: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: '3', title: 'Gemini', url: 'https://gemini.google.com' },
  { id: '4', title: 'DeepSeek', url: 'https://chat.deepseek.com' },
  { id: '5', title: 'Bilibili', url: 'https://www.bilibili.com' },
  { id: '6', title: 'SiliconFlow', url: 'https://siliconflow.cn' },
  { id: '7', title: 'Chaoxing', url: 'https://i.chaoxing.com/' },
  { id: '8', title: 'Superbed', url: 'https://www.superbed.cn/' },
];

export const SEARCH_ENGINES: Record<SearchEngine, SearchEngineConfig> = {
  [SearchEngine.Google]: {
    name: 'Google',
    url: 'https://www.google.com/search',
    queryParam: 'q',
    placeholder: 'Search Google...',
  },
  [SearchEngine.Baidu]: {
    name: 'Baidu',
    url: 'https://www.baidu.com/s',
    queryParam: 'wd',
    placeholder: '百度一下，你就知道',
  },
  [SearchEngine.Bing]: {
    name: 'Bing',
    url: 'https://www.bing.com/search',
    queryParam: 'q',
    placeholder: 'Search Bing...',
  },
};