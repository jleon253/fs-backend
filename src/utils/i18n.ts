import esMessages from '../locales/es.json';

interface TranslationVariables {
  [key: string]: string | number;
}

export const t = (path: string, variables: TranslationVariables = {}): string => {
  const message = path.split('.').reduce((obj: any, key: string) => obj?.[key], esMessages);

  if (!message || typeof message !== 'string') {
    return path; // Return the path as a fallback if the message is not found
  }

  let translatedMessage: string = message;
  Object.keys(variables).forEach((key) => {
    translatedMessage = translatedMessage.replace(`{{${key}}}`, String(variables[key]));
  });
  return translatedMessage;
};