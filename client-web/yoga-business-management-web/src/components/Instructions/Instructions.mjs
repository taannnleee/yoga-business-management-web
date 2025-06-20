import React, { useState } from 'react'

import { poseInstructions } from '../../utils/data'


import './Instructions.css'

export const poseImages = {
    Tree: "/pose_images/tree.jpg",
    Cobra: "/pose_images/cobra.jpg",
    Dog: "/pose_images/dog.jpg",
    Warrior: "/pose_images/warrior.jpg",
    Chair: "/pose_images/chair.jpg",
    Traingle: "/pose_images/traingle.jpg",
    Shoulderstand: "/pose_images/shoulderstand.jpg",
    Half_Frog: "/pose_images/halffrog.png"
};
export default function Instructions({ currentPose }) {

    const [instructions, setInsntructions] = useState(poseInstructions)

    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {instructions[currentPose].map((instruction) => {
                    return (
                        <li className="instruction">{instruction}</li>
                    )

                })}
            </ul>
            <img
                className="pose-demo-img"
                src={poseImages[currentPose]}
            />
        </div>
    )
}
