import { redirect } from 'next/navigation';

export default function Home() {
  console.warn("🚀 ~ Home ~ dashboard Page");
  redirect('/dashboard');
}
