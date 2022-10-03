import Avatar, { genConfig } from 'react-nice-avatar'
import stringHash from '@sindresorhus/string-hash';

const reactNiceAvatarConfigOptions = {
  shapes: [ 'circle', 'round', 'square' ],
  sexes: [ 'man', 'woman' ],
  earSizes: [ 'small', 'big' ],
  hairStyles: [ 'normal', 'thick', 'mohawk', 'womanLong', 'womanShort' ],
  hatStyles: [ 'none', 'beanie', 'turban' ],
  eyeStyles: [ 'circle', 'oval', 'smile' ],
  glassesStyles: [ 'none', 'round', 'square' ],
  noseStyles: [ 'short', 'long', 'round' ],
  mouthStyles: [ 'laugh', 'smile', 'peace' ],
  shirtStyles: [ 'hoody', 'short', 'polo' ],

  faceColors: [ '#E9CBA9', '#EFD1B7', '#F7DDC2', '#F7E2AB', '#F1C088', '#E5BB91', '#EDC186', '#D29C7B', '#CD9564', '#94603B', '#7F4829', '#5E3915', '#4D392C' ],
  hairColors: [ "#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90" ],
  hatColors: [ "#C20D90", "#92A1C6", "#146A7C", "#F0AB3D", "#C271B4" ],
  shirtColors: [ "#C271B4", "#C20D90", "#92A1C6", "#146A7C", "#F0AB3D" ] ,
  bgColors: [ "#F0AB3D", "#C271B4", "#C20D90", "#92A1C6", "#146A7C" ]
}

const textToAvatar = (str) => {
  const hashVal = stringHash(str);
  const opts = reactNiceAvatarConfigOptions;

  const mod = (length) => {
    return hashVal % length
  }

  const avatarConfig = {
    shape: opts.shapes[mod(opts.shapes.length)],
    sex: opts.sexes[mod(opts.sexes.length)],
    earSize: opts.earSizes[mod(opts.earSizes.length)],
    hairStyle: opts.hairStyles[mod(opts.hairStyles.length)],
    hatStyle: opts.hatStyles[mod(opts.hatStyles.length)],
    eyeStyle: opts.eyeStyles[mod(opts.eyeStyles.length)],
    glassesStyle: opts.glassesStyles[mod(opts.glassesStyles.length)],
    noseStyle: opts.noseStyles[mod(opts.noseStyles.length)],
    mouthStyle: opts.mouthStyles[mod(opts.mouthStyles.length)],
    shirtStyle: opts.shirtStyles[mod(opts.shirtStyles.length)],

    faceColor: opts.faceColors[mod(opts.faceColors.length)],
    hairColor: opts.hairColors[mod(opts.hairColors.length)],
    hatColor: opts.hatColors[mod(opts.hatColors.length)],
    shirtColor: opts.shirtColors[mod(opts.shirtColors.length)],
    bgColor: opts.bgColors[mod(opts.bgColors.length)]
  }

  const config = genConfig(avatarConfig);
  return (<Avatar style={{ width: "36px", height: "36px" }} {...config} />);
}

export { textToAvatar };