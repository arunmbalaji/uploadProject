import React, { Component } from "react"
// import logo from '../../components/Logo/logo.svg';
import { AmplifySignOut } from '@aws-amplify/ui-react'
import Header from '../../components/Header/Header';
import Content from './Content';
import Footer from '../../components/Footer/Footer';

class Index extends Component {
    render() {
        return (
            <div class="main-container">
                <Header />
                <Content />
                <Footer />
                <AmplifySignOut />
            </div>

        )
    }
}

export default Index;