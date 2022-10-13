import Avvvatars from 'avvvatars-react'

const textToAvatar = (str: string) => {
  // const hashVal = stringHash(str);
  // const opts = reactNiceAvatarConfigOptions;

  // const mod = (length: number) => {
  //   return hashVal % length
  // }

  // const avatarConfig = {
  //   shape: opts.shapes[mod(opts.shapes.length)],
  //   sex: opts.sexes[mod(opts.sexes.length)],
  //   earSize: opts.earSizes[mod(opts.earSizes.length)],
  //   hairStyle: opts.hairStyles[mod(opts.hairStyles.length)],
  //   hatStyle: opts.hatStyles[mod(opts.hatStyles.length)],
  //   eyeStyle: opts.eyeStyles[mod(opts.eyeStyles.length)],
  //   glassesStyle: opts.glassesStyles[mod(opts.glassesStyles.length)],
  //   noseStyle: opts.noseStyles[mod(opts.noseStyles.length)],
  //   mouthStyle: opts.mouthStyles[mod(opts.mouthStyles.length)],
  //   shirtStyle: opts.shirtStyles[mod(opts.shirtStyles.length)],

  //   faceColor: opts.faceColors[mod(opts.faceColors.length)],
  //   hairColor: opts.hairColors[mod(opts.hairColors.length)],
  //   hatColor: opts.hatColors[mod(opts.hatColors.length)],
  //   shirtColor: opts.shirtColors[mod(opts.shirtColors.length)],
  //   bgColor: opts.bgColors[mod(opts.bgColors.length)]
  // }

  // const config = genConfig(avatarConfig);
  return <Avvvatars value={ str } style="shape"  border={ true } />;
}

export { textToAvatar };