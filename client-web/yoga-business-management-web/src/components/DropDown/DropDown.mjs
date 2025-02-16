import React from 'react'

export const poseImages = {
    Tree: "/pose_images/tree.jpg",
    Cobra: "/pose_images/cobra.jpg",
    Dog: "/pose_images/dog.jpg",
    Warrior: "/pose_images/warrior.jpg",
    Chair: "/pose_images/chair.jpg",
    Traingle: "/pose_images/traingle.jpg",
    Shoulderstand: "/pose_images/shoulderstand.jpg"
};

import './Dropdown.css'

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
    return (
        <div
            className='dropdown dropdown-container'

        >
            <button
                className="btn btn-secondary dropdown-toggle"
                type='button'
                data-bs-toggle="dropdown"
                id="pose-dropdown-btn"
                aria-expanded="false"
            >{currentPose}
            </button>
            <ul class="dropdown-menu dropdown-custom-menu" aria-labelledby="dropdownMenuButton1">
                {poseList.map((pose) => (
                    <li onClick={() => setCurrentPose(pose)}>
                        <div class="dropdown-item-container">
                            <p className="dropdown-item-1">{pose}</p>
                            <img
                                src={poseImages[pose]}
                                className="dropdown-img"
                            />

                        </div>
                    </li>
                ))}

            </ul>


        </div>
    )
}
