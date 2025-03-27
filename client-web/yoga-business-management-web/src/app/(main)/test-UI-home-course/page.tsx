"use client"
import { div } from '@tensorflow/tfjs-core'
import React from 'react'
import { useState } from 'react'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { Hero } from './Hero'


const page = () => {


    return (
        <div>
            <Header></Header>
            <Navbar></Navbar>
            <Hero></Hero>
        </div>

    )
}
export default page;
