import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import PropTypes from "prop-types";
export function Provider(props) {
    return (
        <ChakraProvider value={props.value}>
            <ThemeProvider>{props.children}</ThemeProvider>
        </ChakraProvider>
    );
}

Provider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
};
