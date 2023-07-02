import React from 'react'

export default function Footer(props) {
    return (
        <footer className="bg-light text-center text-lg-start">
            {/* Copyright */}
            <div
                className="text-center p-3 d-flex justify-content-around"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            >
                <span>© 2020 Copyright | {props.companyName} </span>
                <span> Inventory-Management-System | Developed By : {props.name}</span>
                <span> 
                    <a href={props.twitterUrl} className="fa-brands fa-twitter fa-lg mx-1" aria-hidden="true" target='_blank' rel="noreferrer"> </a>
                    <a href={props.linkedinUrl} className="fa-brands fa-linkedin fa-lg mx-1" aria-hidden="true" target='_blank' rel="noreferrer"> </a> 
                    <a href={props.instaUrl} className="fa-brands fa-instagram fa-lg mx-1" aria-hidden="true" target='_blank' rel="noreferrer"> </a> 
                </span>
            </div>
            {/* Copyright */}
        </footer>

    )
}
