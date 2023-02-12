// Component to render the architecture deisgn suggestions
// and resource table and cost estimate from the backend API


import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Text, Heading, VStack, Divider } from "@chakra-ui/react";


function ArchitectureSuggestion({ suggestion }) {
    return (
        <div>
            <Heading as="h2" size="lg" my={3}>Architecture Suggestion</Heading>
            <Text>{suggestion}</Text>
        </div>
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
            <TableContainer>
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
                                    <Td>{resource.component}</Td>
                                    <Td>{resource.spec}</Td>
                                    <Td>{resource.units}</Td>
                                    <Td>{resource.cost}</Td>
                                    <Td>{resource.desc}</Td>
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