interface KanbanPunchHoleProps { }

const KanbanPunchHole = (props: KanbanPunchHoleProps) => {
    return (
        <div style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            top: "6px",
            right: "5px",
            boxShadow: "inset 0px 0px 1px rgba(0, 0, 0, 0.2)",
            borderRadius: "100px",
            background: "white"
        }}></div>
    )
}

export default KanbanPunchHole;