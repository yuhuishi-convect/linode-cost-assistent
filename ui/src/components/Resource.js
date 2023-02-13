// Component to render the architecture deisgn suggestions
// and resource table and cost estimate from the backend API


import { Container, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Text, Heading, VStack, Divider } from "@chakra-ui/react";


function ArchitectureSuggestion({ suggestion }) {
    return (
        <Container maxW={"60%"}>
            <Heading as="h2" size="lg" my={3}>Architecture Suggestion</Heading>
            <Text
            >{suggestion}</Text>
        </Container>
    )
}


function ResourceTable({ resources }) {
    // resources is a list of resource objects
    // each resource object has the following fields:
    // {
    //    "component": "string",
    //    "spec": "string",
    //    "units": "string",
    //    "cost": "string",
    //    "desc": "string",

    // }

    return (
        <div>
            <Heading as="h2" size="lg" my={3}>Resource Table</Heading>
            <TableContainer >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Component</Th>
                            <Th>Spec</Th>
                            <Th>Units</Th>
                            <Th>Cost</Th>
                            <Th>Description</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {resources.map((resource) => {
                            return (
                                <Tr>
                                    <Td>{resource.Component}</Td>
                                    <Td>{resource.Spec}</Td>
                                    <Td>{resource.Units}</Td>
                                    <Td>{resource.Cost}</Td>
                                    <Td>{resource.Desc}</Td>
                                </Tr>
                            )
                        }
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
}


export default function ResourceSummary({
    resources,
    analysis,
}) {
    console.log(resources)
    return (
        <VStack spacing={6}>
            <ArchitectureSuggestion suggestion={analysis} />
            <Divider />
            <ResourceTable resources={resources} />
        </VStack>

    )
}