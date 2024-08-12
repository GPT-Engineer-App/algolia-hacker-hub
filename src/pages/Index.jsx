import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const fetchHackerNews = async (query) => {
  const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${query}`);
  return response.data.hits;
};

const Index = () => {
  const [query, setQuery] = useState('');
  const { data: stories, isLoading, isError, refetch } = useQuery({
    queryKey: ['hackerNews', query],
    queryFn: () => fetchHackerNews(query),
    enabled: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Hacker News Search</h1>
      <form onSubmit={handleSearch} className="mb-8 flex gap-2 justify-center">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
      {isLoading && <p className="text-center">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error fetching stories</p>}
      {stories && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.objectID}>
              <CardHeader>
                <CardTitle className="text-lg">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  By {story.author} | {story.points} points | {story.num_comments} comments
                </p>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
