import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { Key } from 'react';

import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

interface Quote {
  quote: string;
  by: string;
  id: string;
};

// get data, so maybe can get a session cookie here
export const loader = async ({ request }) => {
  const user = await getUser(request);

  return json({
    quotes: await db.quote.findMany(),
    user
  });
};

export default function Index() {
  const { quotes, user } = useLoaderData();

  return (
    <div>
      <nav className="bg-gradient-to-br from-purple 400 via-purple-500 to-purple-500 w-full fixed top-0 left-0 px5">
        <div className="grid lg:grid-flow-row grid-cols-1 lg:grid-cols-3">
          {
            quotes.map((q: Quote, i: Key | null | undefined) => {
              const { id, quote, by } = q;
              return (
                <figure key={id} className="m-4 py-10 px-4 shadow-md shadow-sky-100">
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
            {
              user ? (
                <>
                  <Link to={"new-quote"}>Add a Quote</Link>
                  <form action="/logout" method="post">
                    <button type="submit" className="button">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link to={"login"}>Login</Link>
                  <Link to={"login"}>Register</Link>
                </>
              )
            }
            {/* <Link to={"login"}>Login</Link>
            <Link to={"register"}>Register</Link>
            <Link to={"new-quote"}>Add A Quote</Link>
            <Link to={"logout"}>Logout</Link> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
