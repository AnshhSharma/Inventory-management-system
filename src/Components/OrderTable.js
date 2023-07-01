import React from 'react'
import './Table.css'

export default function Table(props) {

    return (
        <>
            <div className="container" >
                <div className="row" >
                    <div className="col-md-offset-1 col-md-10" style={{ width: 'fit-content', margin: 'auto' }}>
                        <div className="panel">
                            <div className="panel-heading">
                                <div className="row">
                                    <div className="col col-sm-3 col-xs-12">
                                        <h4 className="title">
                                            {props.orderType} <span>Orders</span>
                                        </h4>
                                    </div>
                                    <div className="col-sm-9 col-xs-12 text-right">
                                        <div className="btn_group">
                                            <input
                                                type="text"
                                                className="form-control mx-2"
                                                placeholder="Search"
                                                style={{ width: '50%' }}
                                            />
                                            <button className="btn btn-default mx-2" title="Reload">
                                                <i className="fa fa-sync-alt" />
                                            </button>
                                            <button className="btn btn-default mx-2" title="Pdf" onClick={props.onPdfDownload}>
                                                <i className="fa fa-file-pdf" />
                                            </button>
                                            <button className="btn btn-default mx-2" title="Excel" onClick={props.onXlDownload}>
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
                                            {props.headings.map((element, index) => <th key={index}>{element}</th>)}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.data.map((element, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{element.id}</td>
                                                    <td>{element.type}</td>
                                                    <td>{element.quantity}</td>
                                                    <td>
                                                        <ul className="action-list">
                                                            <li>
                                                                <div style={{ cursor: 'pointer' }} title="edit">
                                                                    <i className="fa fa-edit mx-2"  />
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div style={{ cursor: 'pointer' }} title="delete">
                                                                    <i className="fa fa-trash mx-2" onClick={()=>{props.onDelete(element.id)}}/>
                                                                </div>
                                                            </li>
                                                            <li>{props.orderType === 'Pending' ?
                                                                <div style={{ cursor: 'pointer' }} title="Mark As Complete  ">
                                                                    <i className="fa fa-check mx-2" onClick={()=>{props.onMarkAsCompleted(element.id)}}/>
                                                                </div>
                                                                :
                                                                <div style={{ cursor: 'pointer' }} title="Mark As Pending">
                                                                    <i className="fa-sharp fa-solid fa-xmark" onClick={()=>{props.onMarkAsPending(element.id)}}/>
                                                                </div>
                                                                
                                                            }
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
