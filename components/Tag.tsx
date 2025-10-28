
import React from 'react';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="inline-block bg-sky-100 text-sky-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-sky-900 dark:text-sky-300">
      {label}
    </span>
  );
};

export default Tag;
