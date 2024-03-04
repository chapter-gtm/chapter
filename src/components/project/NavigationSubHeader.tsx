import clsx from 'clsx';

export default function NavigationSubHeader({text}: {text: string}) {
  return (
    <div className='flex-row items-center gap-x-3 flex px-5 mt-6 mb-2'>
        <div className='text-sm font-medium text-slate-500'>{text}</div>
    </div>
)}