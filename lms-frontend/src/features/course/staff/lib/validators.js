export const emailValid = (v) => /^\S+@\S+\.\S+$/.test((v || '').trim());
export const phoneLooksValid = (v) => /^[\d\s()+-]{6,}$/.test((v || '').trim());
