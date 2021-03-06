"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONTransformer = void 0;
const as_1 = require("visitor-as/as");
const JSONBuilder_1 = require("./JSONBuilder");
const classExporter_1 = require("./classExporter");
class JSONTransformer extends as_1.Transform {
    afterParse(parser) {
        this.parser = parser;
        const writeFile = this.writeFile;
        const baseDir = this.baseDir;
        let newParser = new as_1.Parser(parser.diagnostics);
        // Filter for near files
        let files = JSONBuilder_1.JSONBindingsBuilder.nearFiles(this.parser.sources);
        // Visit each file
        files.forEach((source) => {
            let writeOut = /\/\/.*@nearfile .*out/.test(source.text);
            // Remove from logs in parser
            parser.donelog.delete(source.internalPath);
            parser.seenlog.delete(source.internalPath);
            // Remove from programs sources
            this.parser.sources = this.parser.sources.filter((_source) => _source !== source);
            this.program.sources = this.program.sources.filter((_source) => _source !== source);
            // Export main singleton class if one is present
            classExporter_1.ClassExporter.visit(source);
            // Build new Source
            let sourceText = JSONBuilder_1.JSONBindingsBuilder.build(source);
            if (writeOut) {
                writeFile("out/" + source.normalizedPath, sourceText, baseDir);
            }
            // Parses file and any new imports added to the source
            newParser.parseFile(sourceText, (JSONBuilder_1.isEntry(source) ? "" : "./") + source.normalizedPath, JSONBuilder_1.isEntry(source));
            let newSource = newParser.sources.pop();
            this.program.sources.push(newSource);
            parser.donelog.add(source.internalPath);
            parser.seenlog.add(source.internalPath);
            parser.sources.push(newSource);
        });
        classExporter_1.ClassExporter.classSeen = null;
    }
}
exports.JSONTransformer = JSONTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQThFO0FBQzlFLCtDQUE2RDtBQUU3RCxtREFBZ0Q7QUFHaEQsTUFBTSxlQUFnQixTQUFRLGNBQVM7SUFHckMsVUFBVSxDQUFDLE1BQWM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksU0FBUyxHQUFHLElBQUksV0FBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUvQyx3QkFBd0I7UUFDeEIsSUFBSSxLQUFLLEdBQUcsaUNBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0Qsa0JBQWtCO1FBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN2QixJQUFJLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pELDZCQUE2QjtZQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNDLCtCQUErQjtZQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQzlDLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUN4QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNoRCxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FDeEMsQ0FBQztZQUNGLGdEQUFnRDtZQUNoRCw2QkFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixtQkFBbUI7WUFDbkIsSUFBSSxVQUFVLEdBQUcsaUNBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELElBQUksUUFBUSxFQUFFO2dCQUNaLFNBQVMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDaEU7WUFDRCxzREFBc0Q7WUFDdEQsU0FBUyxDQUFDLFNBQVMsQ0FDakIsVUFBVSxFQUNWLENBQUMscUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsY0FBYyxFQUNyRCxxQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUNoQixDQUFDO1lBQ0YsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUcsQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILDZCQUFhLENBQUMsU0FBUyxHQUFHLElBQUssQ0FBQztJQUNsQyxDQUFDO0NBQ0Y7QUFFUSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zZm9ybSwgUGFyc2VyLCBTb3VyY2UsIE1vZHVsZSwgU291cmNlS2luZCB9IGZyb20gXCJ2aXNpdG9yLWFzL2FzXCI7XG5pbXBvcnQgeyBKU09OQmluZGluZ3NCdWlsZGVyLCBpc0VudHJ5IH0gZnJvbSBcIi4vSlNPTkJ1aWxkZXJcIjtcbmltcG9ydCB7IFR5cGVDaGVja2VyIH0gZnJvbSBcIi4vdHlwZUNoZWNrZXJcIjtcbmltcG9ydCB7IENsYXNzRXhwb3J0ZXIgfSBmcm9tIFwiLi9jbGFzc0V4cG9ydGVyXCI7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gXCJ2aXNpdG9yLWFzXCI7XG5cbmNsYXNzIEpTT05UcmFuc2Zvcm1lciBleHRlbmRzIFRyYW5zZm9ybSB7XG4gIHBhcnNlcjogUGFyc2VyO1xuXG4gIGFmdGVyUGFyc2UocGFyc2VyOiBQYXJzZXIpOiB2b2lkIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICBjb25zdCB3cml0ZUZpbGUgPSB0aGlzLndyaXRlRmlsZTtcbiAgICBjb25zdCBiYXNlRGlyID0gdGhpcy5iYXNlRGlyO1xuICAgIGxldCBuZXdQYXJzZXIgPSBuZXcgUGFyc2VyKHBhcnNlci5kaWFnbm9zdGljcyk7XG5cbiAgICAvLyBGaWx0ZXIgZm9yIG5lYXIgZmlsZXNcbiAgICBsZXQgZmlsZXMgPSBKU09OQmluZGluZ3NCdWlsZGVyLm5lYXJGaWxlcyh0aGlzLnBhcnNlci5zb3VyY2VzKTtcbiAgICAvLyBWaXNpdCBlYWNoIGZpbGVcbiAgICBmaWxlcy5mb3JFYWNoKChzb3VyY2UpID0+IHtcbiAgICAgIGxldCB3cml0ZU91dCA9IC9cXC9cXC8uKkBuZWFyZmlsZSAuKm91dC8udGVzdChzb3VyY2UudGV4dCk7XG4gICAgICAvLyBSZW1vdmUgZnJvbSBsb2dzIGluIHBhcnNlclxuICAgICAgcGFyc2VyLmRvbmVsb2cuZGVsZXRlKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgcGFyc2VyLnNlZW5sb2cuZGVsZXRlKHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xuICAgICAgLy8gUmVtb3ZlIGZyb20gcHJvZ3JhbXMgc291cmNlc1xuICAgICAgdGhpcy5wYXJzZXIuc291cmNlcyA9IHRoaXMucGFyc2VyLnNvdXJjZXMuZmlsdGVyKFxuICAgICAgICAoX3NvdXJjZTogU291cmNlKSA9PiBfc291cmNlICE9PSBzb3VyY2VcbiAgICAgICk7XG4gICAgICB0aGlzLnByb2dyYW0uc291cmNlcyA9IHRoaXMucHJvZ3JhbS5zb3VyY2VzLmZpbHRlcihcbiAgICAgICAgKF9zb3VyY2U6IFNvdXJjZSkgPT4gX3NvdXJjZSAhPT0gc291cmNlXG4gICAgICApO1xuICAgICAgLy8gRXhwb3J0IG1haW4gc2luZ2xldG9uIGNsYXNzIGlmIG9uZSBpcyBwcmVzZW50XG4gICAgICBDbGFzc0V4cG9ydGVyLnZpc2l0KHNvdXJjZSk7XG4gICAgICAvLyBCdWlsZCBuZXcgU291cmNlXG4gICAgICBsZXQgc291cmNlVGV4dCA9IEpTT05CaW5kaW5nc0J1aWxkZXIuYnVpbGQoc291cmNlKTtcbiAgICAgIGlmICh3cml0ZU91dCkge1xuICAgICAgICB3cml0ZUZpbGUoXCJvdXQvXCIgKyBzb3VyY2Uubm9ybWFsaXplZFBhdGgsIHNvdXJjZVRleHQsIGJhc2VEaXIpO1xuICAgICAgfVxuICAgICAgLy8gUGFyc2VzIGZpbGUgYW5kIGFueSBuZXcgaW1wb3J0cyBhZGRlZCB0byB0aGUgc291cmNlXG4gICAgICBuZXdQYXJzZXIucGFyc2VGaWxlKFxuICAgICAgICBzb3VyY2VUZXh0LFxuICAgICAgICAoaXNFbnRyeShzb3VyY2UpID8gXCJcIiA6IFwiLi9cIikgKyBzb3VyY2Uubm9ybWFsaXplZFBhdGgsXG4gICAgICAgIGlzRW50cnkoc291cmNlKVxuICAgICAgKTtcbiAgICAgIGxldCBuZXdTb3VyY2UgPSBuZXdQYXJzZXIuc291cmNlcy5wb3AoKSE7XG4gICAgICB0aGlzLnByb2dyYW0uc291cmNlcy5wdXNoKG5ld1NvdXJjZSk7XG4gICAgICBwYXJzZXIuZG9uZWxvZy5hZGQoc291cmNlLmludGVybmFsUGF0aCk7XG4gICAgICBwYXJzZXIuc2VlbmxvZy5hZGQoc291cmNlLmludGVybmFsUGF0aCk7XG4gICAgICBwYXJzZXIuc291cmNlcy5wdXNoKG5ld1NvdXJjZSk7XG4gICAgfSk7XG5cbiAgICBDbGFzc0V4cG9ydGVyLmNsYXNzU2VlbiA9IG51bGwhO1xuICB9XG59XG5cbmV4cG9ydCB7IEpTT05UcmFuc2Zvcm1lciB9O1xuIl19