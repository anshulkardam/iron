const toBackendRelative = (file) => file.replace(/^backend\//, '');

export default {
  'backend/**/*.{ts,js,json}': (files) => {
    const backendFiles = files
      .filter((file) => file.startsWith('backend/'))
      .map(toBackendRelative);

    if (backendFiles.length === 0) {
      return [];
    }

    return [
      `pnpm --dir backend exec biome check --write ${backendFiles.join(' ')}`,
    ];
  },
};
