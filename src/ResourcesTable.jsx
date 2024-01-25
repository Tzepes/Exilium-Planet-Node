import React from 'react';
import './App.css';
import './Table.css';
import { Table } from '@radix-ui/themes';

function ResourcesTable({parcelInfo}) { 
    return (
        <>
            <Table.Root className='TableRoot'>
                <Table.Header className='TableHeader'>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Iron</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Aluminum</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Titanium</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Copper</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Silver</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Gold</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body className='TableBody'>
                    <Table.Row>
                    <Table.RowHeaderCell>{parcelInfo.resources.minerals.iron}</Table.RowHeaderCell>
                    <Table.Cell>{parcelInfo.resources.minerals.aluminum}</Table.Cell>
                    <Table.Cell>{parcelInfo.resources.minerals.titanium}</Table.Cell>
                    <Table.Cell>{parcelInfo.resources.minerals.copper}</Table.Cell>
                    <Table.Cell>{parcelInfo.resources.minerals.silver}</Table.Cell>
                    <Table.Cell>{parcelInfo.resources.minerals.gold}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>

            <Table.Root className='TableRoot'>
                <Table.Header className='TableHeader'>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Liquid Water</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Ice</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Natural Gas</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body className='TableBody'>
                    <Table.Row>
                        <Table.RowHeaderCell>{parcelInfo.resources.naturalResources.liquidWater}</Table.RowHeaderCell>
                        <Table.Cell>{parcelInfo.resources.naturalResources.ice}</Table.Cell>
                        <Table.Cell>{parcelInfo.resources.naturalGas}</Table.Cell>
                    </Table.Row>
                </Table.Body>
           </Table.Root>
        </>
    );
}

export default ResourcesTable;