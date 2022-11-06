import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';

// Called for POST, PATCH, PUT, DELETE HTTP methods
//  and used to used to edit or mutate data.
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const by = form.get('by');
  const quote = form.get('quote');

  if (
    typeof by !== 'string' || by === '' ||
    typeof quote !== 'string' || quote === ''
  ) {
    redirect('/new-quote');
    throw new Error('Invalid form data');
  }

  const fields = { by, quote };

  await db.quote.create({ data: fields });
  return redirect('/');
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-purple-900 outline-purple-300 `;

export default function NewQuoteRoute() {
  return (
    <div className="flex justify-center items-center content-center">
      <div className="lg:m-10 my-10 md:w-2/3 lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300  font-bold px-5 py-6 rounded-md">
        <form method="post">
          <label className="text-lg leading-7 text-white">
            Quote Master (quote by):
            <input
              type="text"
              className={inputClassName}
              name="by"
              required
            />
          </label>
          <label className="text-lg leading-7 text-white">
            Quote Content:
            <textarea required className={`${inputClassName} resize-none `} id="" cols={30} rows={10} name="quote" />
          </label>
          <button className="my-4 py-3 px-10 text-purple-500 font-bold border-4 hover:scale-105 border-purple-500 rounded-lg bg-white" type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};