import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box, Button, ChakraProvider, FormControl,
  FormLabel, Grid, IconButton, Input, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, theme, Tr, VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';


function App() {
  // Set our initial search term value
  const [searchTerm, setSearchTerm] = useState('')
  const [{ data, meta }, setQueries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // Define our search input handler
  const handleSearchTermInput = (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
      fetchResults(1)

  }, [])


  const fetchResults = async (page) => {
    const response = await fetch(`/queries?page=${page}`)
    const data = await response.json()
    setQueries(data)
    setIsLoading(false)
  }

  const fetchSearchResult = async () => {
    setIsLoading(true)
    const response = await fetch(`/queries/${searchTerm}`)
    const data = await response.json()
    setQueries(data)
    fetchResults(1)
    setSearchTerm('')
  }

  const fetchPrevResult = async (term) => {
    setIsLoading(true)
    const response = await fetch(`/queries/${term}`)
    const data = await response.json()
    setQueries(data)
    fetchResults(1)
  }
  const updateSearchQuery = async (val) => {
    await setSearchTerm(val)
    await fetchPrevResult(val)
  }

  const handlePagination = async (page) => {
    setIsLoading(true)
    await fetchResults(page)
  }

  const handleDelete = async (id) => {
    setIsLoading(true)
    const response = await fetch(`/queries/${id}`, {
      method: 'DELETE'
    })
    
    await response.json()
    fetchResults(meta.page)
    setIsLoading(false)
  }
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" display="flex" justifyContent="center" alignItems="center" flexDirection="column" maxW="50vw" margin="100px auto">
        <Box display="flex" justifyContent="space-between" width="85%">
        <VStack spacing={8}>
          <Box as="form">
          <FormControl width="300">
              <FormLabel htmlFor='search'>Enter Search Term</FormLabel>
              <Input id='search' type='text' value={searchTerm} onChange={handleSearchTermInput} width="300" />
              <Button type="submit" ml={5} onClick={fetchSearchResult} isLoading={isLoading} >Search</Button>
            </FormControl>
          </Box>

          </VStack>
          <ColorModeSwitcher justifySelf="flex-end"  />

        </Box>

        <Grid minH="100vh" p={3}>

        <Skeleton isLoaded={data}>

            <TableContainer>
              <Table variant='simple' colorScheme="linkedin" width="500px">

                <Thead>
                  <Tr>
                    <Th>Query</Th>
                    <Th>Results</Th>
                    <Th>Date</Th>
                    <Th></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {(!data) ? null : data.map(entry => {
                    const date = new Date(entry.createdAt)
                    return (
                      <Tr key={entry.id}>
                        <Td>{entry.query}</Td>
                        <Td>{entry.resultsCount}</Td>
                        <Td>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</Td>
                        <Td><Button onClick={() => updateSearchQuery(entry.query)}>Search for {entry.query}</Button><IconButton variant="ghost" icon={<DeleteIcon />} onClick={() => handleDelete(entry.id)}></IconButton></Td>
                      </Tr>
                    )
                  })}
                </Tbody>

              </Table>
            </TableContainer>
            </Skeleton>

            <Stack spacing={4} direction='row' align='center' justify='center' mt={5}>

              {!meta || !meta.prevPage ? null : (
                <Button onClick={() => handlePagination(meta.prevPage)}>Prev</Button>
              )}
              {!meta || !meta.nextPage ? null : (
                <Button onClick={() => handlePagination(meta.nextPage)}>Next</Button>
              )}
            </Stack>


        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
