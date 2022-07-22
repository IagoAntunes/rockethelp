import { VStack, HStack, Text, Box, useTheme} from 'native-base';
import { ReactNode } from 'react';
import { IconProps } from 'phosphor-react-native'

type Props = {
    title: string;
    description: string;
    footer: string;
    icon: React.ElementType<IconProps>;
    children?: ReactNode;
}

export function CardDetails() {
  return (
    <VStack>

    </VStack>
  );
}   