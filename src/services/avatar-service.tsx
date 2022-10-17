import Avvvatars from 'avvvatars-react'

const textToAvatar = (str: string) => {
  return <Avvvatars value={ str } style="shape"  border={ true } />;
}

export { textToAvatar };