import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getQuotes().map(quote => {
      return db.quote.create({ data: quote });
    })
  )
}

seed();

function getQuotes() {
  return [
    {
      quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      by: 'Nelson Mandela'
    },
    {
      quote: 'The way to get started is to quit talking and begin doing.',
      by: 'Walt Disney'
    },
    {
      quote: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
      by: 'Steve Jobs'
    },
    {
      quote: "If life were predictable it would cease to be life, and be without flavor.",
      by: 'Eleanor Roosevelt'
    },
    {
      quote: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
      by: 'Oprah Winfrey'
    },
    {
      quote: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
      by: 'James Cameron'
    },
    {
      quote: "Life is what happens when you're busy making other plans.",
      by: 'John Lennon'
    }
  ];
}