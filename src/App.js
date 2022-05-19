import React, {useEffect, useState} from 'react';

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Button
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  // Set our initial search term value
  const [searchTerm, setSearchTerm] = useState('')
  const [prevQueries, setPrevQueries] = useState([])

  // Define our search input handler
  const handleSearchTermInput = (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    const requestOptions = {
      method: 'GET'
    }    

    fetch('/queries', requestOptions)
      .then(res => res.json())
      .then(data => setPrevQueries(data.data))
  }, [prevQueries])
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" display="flex" justifyContent="center" alignItems="center">
        <Grid minH="100vh" p={3} maxW="50vw">
          <ColorModeSwitcher justifySelf="flex-end" />
          {JSON.stringify(prevQueries)}
          <VStack spacing={8}>
          <FormControl width="300">
            <FormLabel htmlFor='search'>Enter Search Term</FormLabel>
            <Input id='search' type='text' defaultValue={searchTerm} onChange={handleSearchTermInput} width="300" />
            <Button ml={5} >Search</Button>
          </FormControl>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
