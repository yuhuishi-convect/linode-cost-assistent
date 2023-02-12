// component to collect information about the use case from the user

import { HStack, VStack, Button, Textarea, Select, Switch, NumberInput, NumberInputField, Heading, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ResourceSummary from "./Resource";

function FreeFormUseCase(props) {
    // the free form use case component just contain a text area
    const [useCase, setUseCase] = useState("");

    // when the user types in the text area, the use case state is updated
    const handleUseCaseChange = (event) => {
        setUseCase(event.target.value);
    }

    // when the use case state is updated, the use case is sent to the parent component
    useEffect(() => {
        props.setUseCase(useCase);
    }, [useCase])  // only update when the use case state is updated

    return (
        <div>
            <Textarea
                placeholder="Describe your use case here. E.g., what technology stack you are using, what kind of data you are processing, how many users you have, etc."
                value={useCase}
                size="lg"
                minW={500}
                minH={200}
                onChange={handleUseCaseChange}
            />
        </div>
    )


}


function GuidedFormUseCase(props) {
    // the guided form use case component contains a form to collect information about the use case
    // including the technology stack
    // PV, UV, Concurrent Users
    // QPS, if a database is used
    // the average density of images and videos on a page
    const [
        technologyStack,
        setTechnologyStack
    ] = useState("Wordpress");

    const [
        pv,
        setPv
    ] = useState(1000);

    const [
        uv,
        setUv
    ] = useState(1000);

    const [
        concurrentUsers,
        setConcurrentUsers
    ] = useState(100);

    const [
        qps,
        setQps
    ] = useState(100);

    const [
        imageDensity,
        setImageDensity
    ] = useState('LOW');

    const [
        needDB,
        setNeedDB
    ] = useState(true);


    return (
        <div>
            <FormControl id="technology-stack" my={3}>
                <FormLabel>Technology Stack</FormLabel>
                <Select
                    placeholder="Select option"
                    value={technologyStack}
                    onChange={(event) => setTechnologyStack(event.target.value)}
                >
                    <option value="Wordpress">Wordpress</option>
                    <option value="Laravel">Laravel</option>
                    <option value="Django">Django</option>
                    <option value="Ruby on Rails">Ruby on Rails</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Spring Boot">Spring Boot</option>
                    <option value="Flask">Flask</option>
                    <option value="Express.js">Express.js</option>
                    <option value="ASP.NET">ASP.NET</option>
                    <option value="Other">Other</option>
                </Select>
            </FormControl>
            <FormControl id="pv" my={3}>
                <FormLabel>Page Views (PV)</FormLabel>
                <NumberInput >
                    <NumberInputField
                        value={pv}
                        onChange={(event) => setPv(event.target.value)}
                    />
                </NumberInput>
            </FormControl>
            <FormControl id="uv" my={3}>
                <FormLabel>Unique Visitors (UV)</FormLabel>
                <NumberInput >
                    <NumberInputField
                        value={uv}
                        onChange={(event) => setUv(event.target.value)}
                    />
                </NumberInput>
            </FormControl>
            <FormControl id="concurrent-users" my={3}>
                <FormLabel>Concurrent Users</FormLabel>
                <NumberInput >
                    <NumberInputField
                        value={concurrentUsers}
                        onChange={(event) => setConcurrentUsers(event.target.value)}
                    />
                </NumberInput>
            </FormControl>
            <FormControl id="qps" my={3}>
                <FormLabel>Queries Per Second (QPS)</FormLabel>
                <NumberInput >
                    <NumberInputField
                        value={qps}
                        onChange={(event) => setQps(event.target.value)}
                    />
                </NumberInput>
            </FormControl>
            <FormControl id="image-density" my={3}>
                <FormLabel>Average Image Density</FormLabel>
                <Select
                    placeholder="Select option"
                    value={imageDensity}
                    onChange={(event) => setImageDensity(event.target.value)}
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </Select>
            </FormControl>
            <FormControl id="need-db" my={3}>
                <FormLabel>Do you need a database?</FormLabel>
                <Switch
                    value={needDB}
                    onChange={(event) => setNeedDB(event.target.value)}
                />
            </FormControl>
        </div>

    )
}

export default function Usecase(props) {
    // the use case component contains a free form use case component and a guided form use case component
    // the user can choose to use either of them
    const [useCase, setUseCase] = useState("");
    const [useFreeForm, setUseFreeForm] = useState(true);
    const [costResult, setCostResult] = useState(null);



    function onClickGetCost() {
        // when the user clicks the get cost button, the use case is sent to the parent component

        const dummyResult = {
            "arch": "We recommend using the following architecture: ",
            "resources": [
                {
                    "component": "Frontend",
                    "spec": "1x t3a.medium",
                    "unit": "month",
                    "cost": "0.02",
                    "description": "The frontend is a single EC2 instance that serves the static content and proxies the requests to the backend."
                },
                {
                    "component": "Backend",
                    "spec": "1x t3a.medium",
                    "unit": "month",
                    "cost": "0.02",
                    "description": "The backend is a single EC2 instance that serves the dynamic content."
                },
                {
                    "component": "Database",
                    "spec": "1x db.t3.medium",
                    "unit": "month",
                    "cost": "0.02",
                    "description": "The database is a single RDS instance."
                }
            ]
        }

        setCostResult(dummyResult);
    }


    const SwitchButton = () => {
        // the switch button component is used to switch between the two use case components
        return (
            <div>
                <HStack spacing={2}>

                    <Text>Use free form</Text>
                    <Switch
                        value={useFreeForm}
                        isChecked={useFreeForm}
                        onChange={(event) => setUseFreeForm(!useFreeForm)}
                    />
                </HStack>

            </div>
        )
    }



    return (
        <div>
            <VStack spacing={6}>
                {costResult && <ResourceSummary analysis={costResult.arch} resources={costResult.resources} />}
                <Heading as="h2" size="xl" my={3}>Describe your use case</Heading>
                <SwitchButton />
                {useFreeForm ? <FreeFormUseCase setUseCase={setUseCase} /> : <GuidedFormUseCase setUseCase={setUseCase} />}
                <Button
                    onClick={onClickGetCost}
                >
                    Get Cost
                </Button>
            </VStack>
        </div>
    )
}