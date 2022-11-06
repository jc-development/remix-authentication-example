import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { Key } from 'react';

interface Quote {
  quote: string;
  by: string
};

export const loader = async () => {
  return json({
    quotes: [
      {
        quote: 'Light at the end of the tunnel, dey don cut am.',
        by: 'Brain Jotter'
      },
      {
        quote: 'Promised to stand by you, we don sit down.',
        by: 'Brain Jotter'
      },
      {
        quote: 'Polythecnic wey dey in Italy, Napoli.',
        by: 'Comrade with wisdom and Understanding'
      }
    ]
  });
};

export default function Index() {
  const { quotes } = useLoaderData();

  return (
    <div>
      <nav className="bg-gradient-to-br from-purple 400 via-purple-500 to-purple-500 w-full fixed top-0 left-0 px5">
        <div className="grid lg:grid-flow-row grid-cols-1 lg:grid-cols-3">
          {
            quotes.map((q: Quote, i: Key | null | undefined) => {
              const { quote, by } = q;
              return (
                <figure key={i} className="m-4 py-10 px-4 shadow-md shadow-sky-100">
                  <blockquote cite="https://wisdomman.com" className="py-3">
                    <p className="text-gray-800 text-xl">
                      {quote}
                    </p>
                  </blockquote>
                  <figcaption>
                    <cite className="text-gray-600 text-md mb-4 text-right">
                      - {by}
                    </cite>
                  </figcaption>
                </figure>
              );
            })
          }
        </div>
        <div className="w-full max-w-screen-lg mx-auto flex justify-between content-center py-3">
          <Link className="text-white text-3xl font-bold" to={"/"}>Quote Wall</Link>
          <div className="flex flex-col md:flex-row items-center justify-between gap-x-4 text-blue-50">
            <Link to={"login"}>Login</Link>
            <Link to={"register"}>Register</Link>
            <Link to={"new-quote"}>Add A Quote</Link>
            <Link to={"logout"}>Logout</Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
