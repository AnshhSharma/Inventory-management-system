import React from 'react'
import './Table.css'

export default function StockTable(props) {

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
                                            {props.tableOf === 'log' ? <span>LOGS</span> : <span>STOCKS</span>}
                                        </h4>
                                    </div>
                                    <div className="col-sm-9 col-xs-12 text-right">
                                        <div className="btn_group">
                                            <input
                                                type="text"
                                                className="form-control mx-2"
                                                placeholder="Search"
                                                style={{ width: '45%' }}
                                            />
                                            <button className="btn btn-default mx-2" title="Reload">
                                                <i className="fa fa-sync-alt" />
                                            </button>
                                            <button className="btn btn-default mx-2" title="Pdf">
                                                <i className="fa fa-file-pdf" />
                                            </button>
                                            <button className="btn btn-default mx-2" title="Excel">
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
                                            {props.tableOf === 'log' ? <th>Actions</th> : <></>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.data.map((element, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    {props.tableOf === 'log' ? <td>{element.id}</td> : <></>}

                                                    <td>{element.type}</td>
                                                    <td>{element.quantity}</td>

                                                    {props.tableOf === 'log' ? <td>{element.price}</td> : <></>}
                                                    {props.tableOf === 'log' ?
                                                        <td>
                                                            <ul className="action-list">
                                                                <li>
                                                                    <div style={{ cursor: 'pointer' }} title="edit">
                                                                        <i className="fa fa-edit mx-2" />
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div style={{ cursor: 'pointer' }} title="delete">
                                                                        <i className="fa fa-trash mx-2" onClick={() => { props.onDelete(element.id) }} />
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                            :
                                                            <></>

                                                        }
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
