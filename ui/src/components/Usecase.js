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
    ] = useState(null);

    const [
        uv,
        setUv
    ] = useState(null);

    const [
        concurrentUsers,
        setConcurrentUsers
    ] = useState(null);

    const [
        qps,
        setQps
    ] = useState(null);

    const [
        imageDensity,
        setImageDensity
    ] = useState('LOW');

    const [
        needDB,
        setNeedDB
    ] = useState(true);

    // if any of the field changes, we send a request to /api/usecase to get the resource summary
    // and update the usecase description in the parent component
    useEffect(() => {
        // construct the payload, ignore any empty field
        const data = {
            "tech": technologyStack,
            "pv": parseInt(pv),
            "uv": parseInt(uv),
            "concurrent_users": parseInt(concurrentUsers),
            "qps": parseInt(qps),
            "image_density": imageDensity,
            "need_db": needDB === "true" ? true : false,
        }
        // ignore any empty field or null value
        Object.keys(data).forEach(key => {
            if (data[key] === null || data[key] === "") {
                delete data[key];
            }
        })


        fetch(process.env.REACT_APP_API_BASE_URL + "/usecase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(
            response => response.json()
        ).then(
            data => {
                props.setUseCase(data["desc"]);
            }
        ).catch(
            error => console.log(error)
        )
        console.log(data);

    }, [technologyStack, pv, uv, concurrentUsers, qps, imageDensity, needDB])

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
    const [isLoading, setIsLoading] = useState(false);



    function onClickGetCost() {
        setIsLoading(true);
        console.log("loading")
        // when the user clicks the get cost button, the use case is sent to the parent component
        // constrcut the payload
        const data = {
            desc: useCase
        }

        // send the request to /arch
        fetch(process.env.REACT_APP_API_BASE_URL + "/arch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(
            response => response.json()
        ).then(
            data => {
                // update the cost result in the parent component
                setCostResult(data);
                setIsLoading(false);
            }
        ).catch(
            error => console.log(error)
        )


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
                <HStack spacing={4}>
                    <Button
                        onClick={onClickGetCost}
                        colorScheme="whatsapp"
                        isLoading={isLoading}
                    >
                        Get Cost
                    </Button>

                    <Button
                        onClick={() => setCostResult(null)}
                    >
                        Reset
                    </Button>

                </HStack>

            </VStack>
        </div>
    )
}