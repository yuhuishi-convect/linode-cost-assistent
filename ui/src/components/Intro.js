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
                        fontSize: "3.5rem",
                        marginLeft: "0.5rem",
                        marginRight: "0.5rem"
                    }
                    }
                > LinodeCostGPT</span></Heading>
            <Container m={3} >

                <Text size="l">
                    This app will help you estimate the resources and cost to run your use case on Linode.
                    It is built upon <a href="https://openai.com/api">Open AI's GPT API</a>.

                    To get started, type in your use case below and click "Get Cost". Or use the guided form to provide more details about your use case.
                </Text>

            </Container>
            {/* <StartOnGithubButton /> */}
            <GitHubButton href="https://github.com/yuhuishi-convect/linode-cost-assistent" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star yuhuishi-convect/linode-cost-assistent on GitHub">Star Me</GitHubButton>

        </div>

    )
}
