import bcrypt from 'bcryptjs';
import {
  createCookieSessionStorage,
  redirect
} from '@remix-run/node';
import { db } from './db.server';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

// create the session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally `secure: true`
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  }
});

// gets the stored session and sets it to the unique user ID
// and sets the cookie to the request header
export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

// retrieve the user id from the existing session
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

// retrieves the user cookie from the request headers
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') return null;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });
    return user;
  } catch {
    throw logout(request);
  }
}

// helper fn to prevent unauthenticated users from creating quotes
// users not signed in will be redirected to the login page when try to create a quote
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([
      ['redirectTo', redirectTo]
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// login, register, and logout functions
type LoginForm = {
  username: string;
  password: string;
};

export async function register({
  username,
  password,
}: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { username, passwordHash },
  });
  return { id: user.id, username };
}

export async function login({
  username,
  password,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isCorrectPassword) return null;

  return { id: user.id, username };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}