import styled from 'styled-components'

export const StRoot = styled.div`
  position: absolute;
  left:0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const StStartStream = styled.button`
  width: 6rem;
  height: 3rem;
  cursor: pointer;
`
export const StVideo: any = styled.video`
  width: ${({ haveStream }: any) => haveStream ? 'auto' : 0};
  height: ${({ haveStream }: any) => haveStream ? 'auto' : 0};
  background: ${({ haveStream }: any) => haveStream ? 'black' : 'transparent'};
`
