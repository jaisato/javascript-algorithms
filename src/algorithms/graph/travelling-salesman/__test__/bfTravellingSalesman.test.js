import GraphVertex from '../../../../data-structures/graph/GraphVertex';
import GraphEdge from '../../../../data-structures/graph/GraphEdge';
import Graph from '../../../../data-structures/graph/Graph';
import bfTravellingSalesman from '../bfTravellingSalesman';

describe('bfTravellingSalesman', () => {
  it('should solve problem for simple graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB, 1);
    const edgeBD = new GraphEdge(vertexB, vertexD, 1);
    const edgeDC = new GraphEdge(vertexD, vertexC, 1);
    const edgeCA = new GraphEdge(vertexC, vertexA, 1);

    const edgeBA = new GraphEdge(vertexB, vertexA, 5);
    const edgeDB = new GraphEdge(vertexD, vertexB, 8);
    const edgeCD = new GraphEdge(vertexC, vertexD, 7);
    const edgeAC = new GraphEdge(vertexA, vertexC, 4);
    const edgeAD = new GraphEdge(vertexA, vertexD, 2);
    const edgeDA = new GraphEdge(vertexD, vertexA, 3);
    const edgeBC = new GraphEdge(vertexB, vertexC, 3);
    const edgeCB = new GraphEdge(vertexC, vertexB, 9);

    const graph = new Graph(true);
    graph
      .addEdge(edgeAB)
      .addEdge(edgeBD)
      .addEdge(edgeDC)
      .addEdge(edgeCA)
      .addEdge(edgeBA)
      .addEdge(edgeDB)
      .addEdge(edgeCD)
      .addEdge(edgeAC)
      .addEdge(edgeAD)
      .addEdge(edgeDA)
      .addEdge(edgeBC)
      .addEdge(edgeCB);

    const salesmanPath = bfTravellingSalesman(graph);

    expect(salesmanPath.length).toBe(4);

    expect(salesmanPath[0].getKey()).toEqual(vertexA.getKey());
    expect(salesmanPath[1].getKey()).toEqual(vertexB.getKey());
    expect(salesmanPath[2].getKey()).toEqual(vertexD.getKey());
    expect(salesmanPath[3].getKey()).toEqual(vertexC.getKey());
  });

  it('should count the edge back to the start city', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const graph = new Graph();
    graph
      .addEdge(new GraphEdge(vertexA, vertexB, 1))
      .addEdge(new GraphEdge(vertexB, vertexC, 1))
      .addEdge(new GraphEdge(vertexC, vertexD, 1))
      .addEdge(new GraphEdge(vertexD, vertexA, 100))
      .addEdge(new GraphEdge(vertexA, vertexC, 10))
      .addEdge(new GraphEdge(vertexB, vertexD, 10));

    // A -> B -> C -> D is the lightest path (3), but going back from D costs
    // 100: that tour weighs 103, while A -> B -> D -> C -> A weighs 22.
    const salesmanPath = bfTravellingSalesman(graph);

    expect(salesmanPath.map((vertex) => vertex.getKey())).toEqual(['A', 'B', 'D', 'C']);
  });

  it('should not return a tour that skips a city', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const graph = new Graph();
    graph
      .addEdge(new GraphEdge(vertexA, vertexB, 1))
      .addEdge(new GraphEdge(vertexB, vertexC, 1))
      .addEdge(new GraphEdge(vertexC, vertexA, 1))
      .addEdge(new GraphEdge(vertexA, vertexD, 1));

    // D only links to A, so no tour visits every city once. A -> D used to
    // come out as the answer, with A -> B -> C (which skips D) as another
    // candidate.
    expect(bfTravellingSalesman(graph)).toEqual([]);
  });
});
