'use client';

import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

export default function AddCakeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    imageUrl: '',
    yumFactor: '1',
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      `Cake saved (mock only):\n${formData.name}\nYum factor: ${formData.yumFactor}`
    );
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Cake Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block min-h-11 w-full rounded-md border border-slate-300 p-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-slate-700"
        >
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          minLength={5}
          maxLength={200}
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 p-2"
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-slate-700"
        >
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          required
          placeholder="https://..."
          className="mt-1 block min-h-11 w-full rounded-md border border-slate-300 p-2"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="yumFactor"
          className="block text-sm font-medium text-slate-700"
        >
          Yum Factor (1-5)
        </label>
        <select
          id="yumFactor"
          name="yumFactor"
          required
          className="mt-1 block min-h-11 w-full rounded-md border border-slate-300 p-2"
          value={formData.yumFactor}
          onChange={(e) =>
            setFormData({ ...formData, yumFactor: e.target.value })
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save Cake
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
