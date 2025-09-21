import Layout from '../components/Layout';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// This is the main component for the Home Page
export default function Home({ songs }) {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Recently Added</h1>
        
        {/* Check if there are any songs */}
        {songs && songs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Loop through each song and display it */}
            {songs.map((song) => (
              <div key={song.id} className="bg-gray-medium p-3 rounded-lg hover:bg-gray-light cursor-pointer">
                <img 
                  src={song.album_art_url} 
                  alt={`${song.album} cover`} 
                  className="w-full aspect-square rounded-md mb-2"
                />
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        ) : (
          // Show this message if no songs are found
          <p>No songs have been uploaded yet. Be the first!</p>
        )}
      </div>
    </Layout>
  );
}

// This special function runs on the server before the page is loaded
// It fetches the song data from Supabase
export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false }) // Get the newest songs first
    .limit(20); // Get the latest 20 songs

  if (error) {
    console.error('Error fetching songs:', error.message);
  }

  return {
    props: {
      songs: data || [], // Pass the songs to the page component
    },
  };
};

