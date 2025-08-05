const formatUnit = (weight, unit) => {
  const singulars = {
    kgs: 'kg',
    gms: 'gm',
    ltrs: 'ltr',
    mls: 'ml',
    pcs: 'pc',
  };

  const isSingular = weight === 1;

  if (isSingular && singulars[unit]) {
    return singulars[unit];
  }

  return unit; // fallback to original unit if not found or plural
};

export default formatUnit;