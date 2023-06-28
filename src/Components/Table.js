import React from 'react'
import './Table.css'

export default function Table(props) {



    return (
        <>
            <div className="container" >
                <div className="row" > 
                    <div className="col-md-offset-1 col-md-10" style={{width: 'fit-content', margin: 'auto'}}>
                        <div className="panel">
                            <div className="panel-heading">
                                <div className="row">
                                    <div className="col col-sm-3 col-xs-12">
                                        <h4 className="title">
                                            Data <span>List</span>
                                        </h4>
                                    </div>
                                    <div className="col-sm-9 col-xs-12 text-right">
                                        <div className="btn_group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search"
                                            />
                                            <button className="btn btn-default" title="Reload">
                                                <i className="fa fa-sync-alt" />
                                            </button>
                                            <button className="btn btn-default" title="Pdf">
                                                <i className="fa fa-file-pdf" />
                                            </button>
                                            <button className="btn btn-default" title="Excel">
                                                <i className="fas fa-file-excel" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {props.headings.map((element,index) => <th key={index}>{element}</th>)}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.data.map((element,index) => {
                                            return (
                                                <tr key = {index}>
                                                    <td>{index+1}</td>
                                                    <td>{element.id}</td>
                                                    <td>{element.type}</td>
                                                    <td>{element.quantity}</td>
                                                    <td>
                                                        <ul className="action-list">
                                                            <li>
                                                                <div style={{cursor: 'pointer'}} title="edit">
                                                                    <i className="fa fa-edit" />
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div style={{cursor: 'pointer'}} title="delete">
                                                                    <i className="fa fa-trash" />
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div style={{cursor: 'pointer'}} title="delete">
                                                                    <i className="fa fa-check" />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            );
                                        })}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
