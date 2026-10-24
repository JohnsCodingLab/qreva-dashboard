export const inputStyles = {
  base: `
    peer w-full h-14 px-4 pt-6 pb-2 
    border-2 rounded-md 
    outline-none transition-all
    focus:border-2
    disabled:bg-qreva-ash disabled:cursor-not-allowed
  `,
  withIcon: `
    peer w-full h-14 px-4 pt-6 pb-2 pr-12
    border-2 rounded-md 
    outline-none transition-all
    focus:border-2
    disabled:bg-qreva-ash disabled:cursor-not-allowed
  `,
};

export const buttonStyles = {
  primary: (isValid, isLoading) => `
    w-full h-12 text-base font-semibold transition-all
    ${isValid && !isLoading
      ? 'bg-qreva-orange hover:bg-qreva-orange text-white'
      : 'bg-gray-300 text-qreva-navy cursor-not-allowed'
    }
  `,
  link: 'text-sm text-[#B0B7C3] font-general underline font-semibold leading-[145%] hover:text-qreva-navy disabled:cursor-not-allowed',
};

export const iconButtonStyles = `
  absolute right-3 top-1/2 -translate-y-1/2 
  text-gray-400 hover:text-qreva-navy 
  disabled:cursor-not-allowed
`;