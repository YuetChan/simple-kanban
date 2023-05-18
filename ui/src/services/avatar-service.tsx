import Avvvatars from 'avvvatars-react'

const textToAvatar = (str: string, size=36) => {
  return <Avvvatars value={ str } style="shape" size={size}/>;
}

export { textToAvatar };