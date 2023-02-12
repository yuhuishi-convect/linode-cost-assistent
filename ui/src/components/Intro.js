// a component that describes what the app does
// and how to use it


// with a button to start on github

import { Heading, Link, Text, Container } from "@chakra-ui/react"
import GitHubButton from 'react-github-btn'

export default function Intro() {

    return (
        <div>
            <Heading as="h1" size="2xl" my={3}>Welcome to
                <span 
                    style={{
                        color: "#00b159",
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        marginLeft: "0.5rem",
                        marginRight: "0.5rem"
                    }
                    }
                > ChatLinodeCost</span></Heading>
            <Container m={3} >

                <Text size="l">
                    This app will help you estimate the resources and cost to run your use case on Linode.
                    It is built upon
                    <Link href="https://openai.com/api/" >
                        Open AI's GPT-3 API.
                    </Link>

                    To get started, type in your use case below and click "Get Started". Or use the guided form to provide more details about your use case.
                </Text>

            </Container>
            {/* <StartOnGithubButton /> */}
            <GitHubButton href="https://github.com/yuhuishi-convect/linode-cost-assistent" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star yuhuishi-convect/linode-cost-assistent on GitHub">Give me a Star</GitHubButton>

        </div>

    )
}
