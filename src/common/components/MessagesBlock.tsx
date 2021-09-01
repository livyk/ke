import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react'
import React from 'react'
import { AlertCircle, CheckCircle, HelpCircle, Icon, XCircle } from 'react-feather'

const messageTypeMapping: { [key: string]: string } = {
  success: '#65BBBB',
  warning: '#FFEAB3',
  error: '#FC6363',
  info: '#81C2FE',
}

const messageIconMapping: { [key: string]: Icon } = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: HelpCircle,
}

const MessagesBlock = ({
  messages,
  messageType,
  messageProps,
  messageTextProps,
}: {
  messages: string[] | undefined
  messageType: string
  messageProps?: BoxProps
  messageTextProps?: TextProps
}): JSX.Element => {
  if (typeof messages === 'undefined') return <></>

  const messageColor = messageTypeMapping[messageType]
  const messageIcon = messageIconMapping[messageType]

  return (
    <>
      {messages
        .filter((message: string | null) => message !== null)
        .map((message: string, index) => {
          const key = index
          return (
            <Box bg={messageColor} key={key} display="flex" borderRadius="4px" m={4} {...messageProps}>
              <Box as={messageIcon} size="21px" m={4} mr={0} flexShrink={0} />
              <Text m={3} {...messageTextProps}>
                {message}
              </Text>
            </Box>
          )
        })}
    </>
  )
}

export { MessagesBlock }
