import type {
  ActionFunction,
  LinksFunction,
} from '@remix-run/node';
import {
  useActionData,
  Link,
  useSearchParams,
} from '@remix-run/react';

import { db } from '~/utils/db.server';
import { json } from '@remix-run/node';

function validateUsername(username: string) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 8) {
    return `Password must be at least 8 characters long`;
  }
}

function validateUrl(url: any) {
  console.log('url', url);
  let urls = ["/"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

const badRequest = (data: any) => json(data, { status: 400 })

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-purple-900 outline-purple-300 `;

export default function LoginRoute() {
  const actionData = useActionData();

  // useSearchParams to get the redirectTo query parameter and putting that in a hidden input.
  // This way, our action can know where to redirect the user.
  // We'll use this to redirect a user to the login and registration page.
  const [searchParams] = useSearchParams();

  // searchParams
  // { searchParams: URLSearchParams { } }

  return (
    <div className="flex justify-center items-center content-center text-white">
      <div className="lg:m-10 my-10 md:w-2/3 lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300  font-bold px-5 py-6 rounded-md">
        <form method="post">
          <h1 className="text-conter text-2xl text-white">Login</h1>
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get('redirectTo') ?? undefined
            }
          />
          <fieldset className="text-center">
            <legend className="sr-only">
              Login or Register?
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              Register
            </label>
          </fieldset>
          <label className="text-lg leading-7 text-white">
            Username:
            <input
              type="text"
              className={inputClassName}
              name="username"
              required
              minLength={3}
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.username
              )}
              aria-errormessage={
                actionData?.fieldErrors?.username
                  ? "username-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="text-red-500"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </label>
          <label className="text-lg leading-7 text-white">
            Password
            <input
              name="password"
              className={inputClassName}
              required
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(
                  actionData?.fieldErrors?.password
                ) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="text-red-500"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </label>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="text-red-500"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button className="my-4 py-2 px-7 text-purple-500 font-bold border-2 hover:scale-105 border-purple-500 rounded-lg bg-white" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}